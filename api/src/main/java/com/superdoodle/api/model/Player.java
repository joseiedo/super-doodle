package com.superdoodle.api.model;

import lombok.*;


@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class Player {

    private Long id;

    private Integer positionY;

    private Integer positionX;
}
