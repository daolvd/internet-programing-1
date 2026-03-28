package com.flashcard.backend.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@Entity
@Table(name = "category")
public class Category  extends BaseEntity{

    private String name;
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL)
    private List<Deck> decks = new ArrayList<Deck>();
}
