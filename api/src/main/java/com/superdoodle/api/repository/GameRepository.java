package com.superdoodle.api.repository;

import com.superdoodle.api.model.Game;
import org.springframework.stereotype.Repository;

@Repository
public class GameRepository {

    private final Game game = new Game();

}
