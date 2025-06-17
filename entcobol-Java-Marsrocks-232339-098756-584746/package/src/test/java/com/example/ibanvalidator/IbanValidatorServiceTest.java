package com.example.ibanvalidator;

import org.junit.jupiter.api.Test;
import static org.junit.jupiter.api.Assertions.*;

class IbanValidatorServiceTest {
    private final IbanValidatorService service = new IbanValidatorService();

    @Test
    void validIban_shouldReturnTrue() {
        assertTrue(service.validateIban("DE89370400440532013000")); // Valid German IBAN
    }

    @Test
    void invalidIban_wrongChecksum_shouldReturnFalse() {
        assertFalse(service.validateIban("DE89370400440532013001"));
    }

    @Test
    void invalidIban_wrongLength_shouldReturnFalse() {
        assertFalse(service.validateIban("DE8937040044053201300"));
    }

    @Test
    void invalidIban_unknownCountry_shouldReturnFalse() {
        assertFalse(service.validateIban("ZZ89370400440532013000"));
    }

    @Test
    void nullOrShortIban_shouldReturnFalse() {
        assertFalse(service.validateIban(null));
        assertFalse(service.validateIban("DE8"));
    }
}
