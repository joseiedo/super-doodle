package com.superdoodle.api.model;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Game {


    private Long Id = 1L;

    private List<Player> players = new ArrayList<>();

    public void addPlayer(Player player) {
        this.players.add(player);
    }
}
