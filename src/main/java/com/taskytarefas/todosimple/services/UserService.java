package com.taskytarefas.todosimple.services;

import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.transaction.Transactional;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskytarefas.todosimple.models.User;
import com.taskytarefas.todosimple.models.dto.UserCreateDTO;
import com.taskytarefas.todosimple.models.dto.UserUpdateDTO;
import com.taskytarefas.todosimple.models.enums.ProfileEnum;
import com.taskytarefas.todosimple.repositories.UserRepository;
import com.taskytarefas.todosimple.security.UserSpringSecurity;
import com.taskytarefas.todosimple.services.exceptions.AuthorizationException;

@Service
public class UserService {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired // Cria uma instância da classe automaticamente.
    private UserRepository userRepository;

    // Método: Localizar usuário pelo ID
    public User findById(Long id) {
        UserSpringSecurity userSpringSecurity = authenticated();
        if (!Objects.nonNull(userSpringSecurity)
                || !userSpringSecurity.hasRole(ProfileEnum.ADMIN) && !id.equals(userSpringSecurity.getId()))
            throw new AuthorizationException("Acesso negado!");

        Optional<User> user = this.userRepository.findById(id); // Retorna seu o id veio Null
        return user.orElseThrow(() -> new RuntimeException( // Se for null retorna uma aviso
                "Usuário não encontrado! Id: " + id + ", Tipo: " + User.class.getName()));
    }

    // Método: Localizar usuário pelo email
    public User findByEmail(String email) {
        UserSpringSecurity userSpringSecurity = authenticated();
        if (!Objects.nonNull(userSpringSecurity))
            throw new AuthorizationException("Acesso negado!");

        User user = this.userRepository.findByEmail(email);
        if (user == null)
            throw new RuntimeException("Usuário não encontrado com email: " + email);
        
        // Verifica se o usuário logado é ADMIN ou está acessando seus próprios dados
        if (!userSpringSecurity.hasRole(ProfileEnum.ADMIN) && !email.equals(userSpringSecurity.getUsername()))
            throw new AuthorizationException("Acesso negado!");
            
        return user;
    }

    @Transactional // Garante que toda operação seja feita. Exemplo: Não permite que salve apenas
                   // metade de um usuário.
    public User create(User obj) {
        obj.setId(null);
        obj.setSenha(this.bCryptPasswordEncoder.encode(obj.getSenha()));
        obj.setProfiles(Stream.of(ProfileEnum.USER.getCode()).collect(Collectors.toSet()));
        obj = this.userRepository.save(obj);
        return obj;
    }

    @Transactional
    public User update(User obj) {
        User newObj = findById(obj.getId());
        newObj.setNome(obj.getNome());
        newObj.setEmail(obj.getEmail());
        
        // Apenas atualiza a senha se ela foi preenchida
        if (obj.getSenha() != null && !obj.getSenha().isEmpty()) {
            newObj.setSenha(this.bCryptPasswordEncoder.encode(obj.getSenha()));
        }
        
        return this.userRepository.save(newObj);
    }

    public void delete(Long id) {
        findById(id);
        try {
            this.userRepository.deleteById(id);
        } catch (Exception e) {
            throw new RuntimeException("Não é possivel excluir pois há entidade relacionadas!");
        }
    }

    public static UserSpringSecurity authenticated() {
        try {
            return (UserSpringSecurity) SecurityContextHolder.getContext().getAuthentication().getPrincipal();    
        } catch (Exception e) {
            return null;
        }
    }

    public User fromDTO(@Valid UserCreateDTO obj) {
        User user = new User();
        user.setNome(obj.getNome());
        user.setEmail(obj.getEmail());
        user.setSenha(obj.getSenha());
        return user;
    }

    public User fromDTO(@Valid UserUpdateDTO obj) {
        User user = new User();
        user.setId(obj.getId());
        user.setNome(obj.getNome());
        user.setEmail(obj.getEmail());
        user.setSenha(obj.getSenha());
        return user;
    }

}
