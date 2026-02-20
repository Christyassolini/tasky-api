package com.taskytarefas.todosimple.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.taskytarefas.todosimple.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> { // <User, Long> User significa a classe, e Long o é o TIPO da chave primária.
    
}
