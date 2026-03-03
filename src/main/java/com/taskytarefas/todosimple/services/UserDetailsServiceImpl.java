package com.taskytarefas.todosimple.services;

import java.util.Objects;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.taskytarefas.todosimple.models.User;
import com.taskytarefas.todosimple.repositories.UserRepository;
import com.taskytarefas.todosimple.security.UserSpringSecurity;

@Service
public class UserDetailsServiceImpl implements UserDetailsService{

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = this.userRepository.findByEmail(email);
        if (Objects.isNull(user)) {
            throw new UsernameNotFoundException("Usuário não encontrado: " + email);
        }
        return new UserSpringSecurity(user.getId(),user.getNome(),user.getEmail(), user.getSenha(), user.getProfiles());
    }
}
