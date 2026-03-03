package com.taskytarefas.todosimple.services;

import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.taskytarefas.todosimple.models.User;
import com.taskytarefas.todosimple.models.enums.ProfileEnum;
import com.taskytarefas.todosimple.repositories.UserRepository;

@Service
public class UserService {

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;
    
    @Autowired //Cria uma instância da classe automaticamente.
    private UserRepository userRepository;


    //Método: Localizar usuário pelo ID
    public User findById(Long id) {
        Optional<User> user = this.userRepository.findById(id); //Retorna seu o id veio Null
        return user.orElseThrow(() -> new RuntimeException(     //Se for null retorna uma aviso
            "Usuário não encontrado! Id: " + id + ", Tipo: " + User.class.getName()
        ));
    }

    @Transactional // Garante que toda operação seja feita. Exemplo: Não permite que salve apenas metade de um usuário.
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
        newObj.setSenha(obj.getSenha());
        newObj.setSenha(this.bCryptPasswordEncoder.encode(obj.getSenha()));
        newObj.setNome(obj.getNome());
        newObj.setEmail(obj.getEmail());
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
}
