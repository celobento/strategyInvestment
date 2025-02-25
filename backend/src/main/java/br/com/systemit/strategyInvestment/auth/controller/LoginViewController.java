package br.com.systemit.strategyInvestment.auth.controller;

import org.springframework.web.bind.annotation.GetMapping;

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
