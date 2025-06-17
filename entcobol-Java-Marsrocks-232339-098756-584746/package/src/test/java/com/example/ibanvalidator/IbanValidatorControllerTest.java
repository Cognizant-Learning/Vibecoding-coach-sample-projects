package com.example.ibanvalidator;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@WebMvcTest(IbanValidatorController.class)
class IbanValidatorControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    private IbanValidatorService ibanValidatorService;

    @Test
    void validateIban_valid() throws Exception {
        when(ibanValidatorService.validateIban("DE89370400440532013000")).thenReturn(true);
        mockMvc.perform(get("/api/iban/validate").param("iban", "DE89370400440532013000"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.iban").value("DE89370400440532013000"))
                .andExpect(jsonPath("$.valid").value(true));
    }

    @Test
    void validateIban_invalid() throws Exception {
        when(ibanValidatorService.validateIban("DE89370400440532013001")).thenReturn(false);
        mockMvc.perform(get("/api/iban/validate").param("iban", "DE89370400440532013001"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.iban").value("DE89370400440532013001"))
                .andExpect(jsonPath("$.valid").value(false));
    }
}
