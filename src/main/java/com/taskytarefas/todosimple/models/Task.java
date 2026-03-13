package com.taskytarefas.todosimple.models;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotBlank;
import javax.validation.constraints.Size;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = Task.TABLE_NAME)
@AllArgsConstructor
@NoArgsConstructor
@Data
public class Task {
    public static final String TABLE_NAME = "task";

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", unique = true)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false, updatable = false) //Indica qual será a coluna de ligação (chave estrangeira) no banco.
    private User user;

    @Column(name = "titulo", length = 25, nullable = false)
    @NotBlank
    @Size(min = 1, max = 25)
    private String titulo;

    @Column(name = "description", length = 500, nullable = false)
    @NotBlank
    @Size(min = 1,max = 500)
    private String description;
}
