import { CLIENT_SEED_KEY, USER_ID_KEY } from "../constants/storageKeys";

type QueryValue = string | number | boolean | null | undefined;
type QueryParams = Record<string, QueryValue>;

export interface ApiEnvelope<T> {
	success: boolean;
	message: string;
	data: T;
}

interface AuthResponse {
	id?: number;
	userId?: number;
}

export class ApiError extends Error {
	status: number;
	payload?: unknown;

	constructor(message: string, status: number, payload?: unknown) {
		super(message);
		this.name = "ApiError";
		this.status = status;
		this.payload = payload;
	}
}

class ApiClient {
	private readonly baseUrl: string;
	private authPromise: Promise<void> | null = null;
	private hasAuthenticated = false;

	constructor(baseUrl = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8080") {
		this.baseUrl = baseUrl.replace(/\/$/, "");
	}

	async get<T>(path: string, params?: QueryParams): Promise<T> {
		const requestPath = this.buildPath(path, params);
		return this.request<T>(requestPath, { method: "GET" });
	}

	async post<T>(path: string, body?: unknown): Promise<T> {
		return this.request<T>(path, {
			method: "POST",
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	}

	async put<T>(path: string, body?: unknown): Promise<T> {
		return this.request<T>(path, {
			method: "PUT",
			body: body === undefined ? undefined : JSON.stringify(body),
		});
	}

	async delete<T>(path: string, params?: QueryParams): Promise<T> {
		const requestPath = this.buildPath(path, params);
		return this.request<T>(requestPath, { method: "DELETE" });
	}

	async request<T>(path: string, init: RequestInit, canRetry = true): Promise<T> {
		await this.ensureAuthenticated();

		const response = await fetch(`${this.baseUrl}${path}`, {
			...init,
			credentials: "include",
			headers: this.buildHeaders(init.headers, init.body),
		});

		if (response.status === 401 && canRetry) {
			this.clearAuth();
			return this.request<T>(path, init, false);
		}

		const payload = await this.parseJson(response);

		if (!response.ok) {
			const message =
				this.pickErrorMessage(payload) ||
				`Request failed with status ${response.status}`;
			throw new ApiError(message, response.status, payload);
		}

		const envelope = payload as ApiEnvelope<T>;
		return envelope.data;
	}

	initializeAuth(): Promise<void> {
		return this.ensureAuthenticated();
	}

	clearAuth(): void {
		this.hasAuthenticated = false;
	}

	private async ensureAuthenticated(): Promise<void> {
		if (typeof window === "undefined") return;
		if (this.hasAuthenticated) return;

		if (!this.authPromise) {
			this.authPromise = this.authenticate().finally(() => {
				this.authPromise = null;
			});
		}

		await this.authPromise;
	}

	private async authenticate(): Promise<void> {
		const existingClientSeed = this.getLegacyClientSeed();

		if (existingClientSeed) {
			const loginResult = await fetch(`${this.baseUrl}/api/users/login`, {
				method: "POST",
				credentials: "include",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ clientSeed: existingClientSeed }),
			});

			if (loginResult.ok) {
				const loginPayload = (await this.parseJson(loginResult)) as ApiEnvelope<AuthResponse>;
				this.persistUserId(loginPayload.data);
				this.clearLegacyClientSeed();
				this.hasAuthenticated = true;
				return;
			}
		}

		const cookieLoginResult = await fetch(`${this.baseUrl}/api/users/login-from-cookie`, {
			method: "POST",
			credentials: "include",
		});

		if (cookieLoginResult.ok) {
			const cookieLoginPayload = (await this.parseJson(cookieLoginResult)) as ApiEnvelope<AuthResponse>;
			this.persistUserId(cookieLoginPayload.data);
			this.hasAuthenticated = true;
			return;
		}

		const newClientSeed = this.generateClientSeed();

		const registerResult = await fetch(`${this.baseUrl}/api/users/register`, {
			method: "POST",
			credentials: "include",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ clientSeed: newClientSeed }),
		});

		if (!registerResult.ok) {
			throw new ApiError("Unable to authenticate user with backend.", registerResult.status);
		}

		const registerPayload = (await this.parseJson(registerResult)) as ApiEnvelope<AuthResponse>;
		this.persistUserId(registerPayload.data);
		this.clearLegacyClientSeed();
		this.hasAuthenticated = true;
	}

	private buildPath(path: string, params?: QueryParams): string {
		if (!params || Object.keys(params).length === 0) {
			return path;
		}

		const search = new URLSearchParams();
		Object.entries(params).forEach(([key, value]) => {
			if (value === null || value === undefined) return;
			search.append(key, String(value));
		});

		const query = search.toString();
		return query ? `${path}?${query}` : path;
	}

	private buildHeaders(headers: HeadersInit | undefined, body: BodyInit | null | undefined): Headers {
		const merged = new Headers(headers);

		if (!(body instanceof FormData) && !merged.has("Content-Type")) {
			merged.set("Content-Type", "application/json");
		}

		return merged;
	}

	private getLegacyClientSeed(): string | null {
		if (typeof window === "undefined") return "";
		return window.localStorage.getItem(CLIENT_SEED_KEY);
	}

	private clearLegacyClientSeed(): void {
		if (typeof window === "undefined") return;
		window.localStorage.removeItem(CLIENT_SEED_KEY);
	}

	private generateClientSeed(): string {
		if (typeof window === "undefined") return "";
		const generated =
			typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
				? crypto.randomUUID()
				: `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
		return generated;
	}

	private persistUserId(payload: AuthResponse): void {
		if (typeof window === "undefined") return;
		const userId = payload.userId ?? payload.id;
		if (typeof userId === "number") {
			window.localStorage.setItem(USER_ID_KEY, String(userId));
		}
	}

	private pickErrorMessage(payload: unknown): string | null {
		if (!payload || typeof payload !== "object") return null;

		const record = payload as Record<string, unknown>;
		if (typeof record.message === "string") return record.message;
		if (typeof record.error === "string") return record.error;
		return null;
	}

	private async parseJson(response: Response): Promise<unknown> {
		const text = await response.text();
		if (!text) return null;

		try {
			return JSON.parse(text) as unknown;
		} catch {
			return text;
		}
	}
}

export const apiClient = new ApiClient();
