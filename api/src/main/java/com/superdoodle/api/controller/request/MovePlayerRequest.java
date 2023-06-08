package com.superdoodle.api.controller.request;

import com.superdoodle.api.enums.Direction;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovePlayerRequest {

    private Long id;

    private Direction direction;
}
