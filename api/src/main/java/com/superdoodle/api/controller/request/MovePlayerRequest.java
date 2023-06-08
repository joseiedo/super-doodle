package com.superdoodle.api.controller.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class MovePlayerRequest {

    private Long id;

    private Integer positionY;

    private Integer positionX;
}
