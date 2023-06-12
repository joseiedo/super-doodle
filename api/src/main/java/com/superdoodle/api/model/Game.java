package com.superdoodle.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;


@Data
@AllArgsConstructor
@Builder
public class Game {


    private final int width = 400;

    private final int height = 200;

    private Long Id = 1L;

    private List<Player> players = new ArrayList<>();

    private Fruit fruit;

    public Game(){
        this.fruit = new Fruit(this);
    }


    public void addPlayer(Player player) {
        this.players.add(player);
    }
}
