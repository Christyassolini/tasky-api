package com.taskytarefas.todosimple.models.dto;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class UserCreateDTO {

    @NotBlank
    private String nome;
    
    @Email
    @NotBlank
    private String email;

    @NotBlank
    @Size(min = 6, max = 60)
    private String senha;

}
