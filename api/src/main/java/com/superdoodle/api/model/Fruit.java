package com.superdoodle.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Fruit {
    private String id;

    private Integer positionY;

    private Integer positionX;

    public Fruit(Game game) {
        this.id = UUID.randomUUID().toString();
        this.positionX = (int) (Math.random() * game.getWidth());
        this.positionY = (int) (Math.random() * game.getHeight());
    }
}
