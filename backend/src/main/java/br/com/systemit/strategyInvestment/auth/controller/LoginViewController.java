package br.com.systemit.strategyInvestment.auth.controller;

import br.com.systemit.strategyInvestment.auth.security.CustomAuthentication;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ResponseBody;

//@Controller
public class LoginViewController {

    @GetMapping("/login")
    public String paginaLogin(){
        return "login";
    }

//    @GetMapping("/")
//    @ResponseBody
//    public String paginaHome(Authentication authentication){
//        if(authentication instanceof CustomAuthentication customAuth){
//            System.out.println(customAuth.getUser().getEmail());
//        }
//        return "Olá " + authentication.getName();
//    }

}
