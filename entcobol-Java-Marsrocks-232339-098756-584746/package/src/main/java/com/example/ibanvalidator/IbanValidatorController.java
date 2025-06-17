package com.example.ibanvalidator;

import org.springframework.web.bind.annotation.*;
import org.springframework.beans.factory.annotation.Autowired;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/iban")
public class IbanValidatorController {
    @Autowired
    private IbanValidatorService ibanValidatorService;

    @GetMapping("/validate")
    public IbanValidationResponse validateIban(@RequestParam String iban) {
        boolean valid = ibanValidatorService.validateIban(iban);
        return new IbanValidationResponse(iban, valid);
    }

    public static class IbanValidationResponse {
        public String iban;
        public boolean valid;
        public IbanValidationResponse(String iban, boolean valid) {
            this.iban = iban;
            this.valid = valid;
        }
    }
}
