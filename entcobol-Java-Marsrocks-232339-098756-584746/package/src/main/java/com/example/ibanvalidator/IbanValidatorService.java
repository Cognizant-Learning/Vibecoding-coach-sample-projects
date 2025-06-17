package com.example.ibanvalidator;

import org.springframework.stereotype.Service;
import java.util.HashMap;
import java.util.Map;

@Service
public class IbanValidatorService {
    private static final Map<String, Integer> COUNTRY_LENGTHS = new HashMap<>();
    static {
        COUNTRY_LENGTHS.put("AD", 24); COUNTRY_LENGTHS.put("AE", 23); COUNTRY_LENGTHS.put("AL", 28);
        COUNTRY_LENGTHS.put("AT", 20); COUNTRY_LENGTHS.put("AZ", 28); COUNTRY_LENGTHS.put("BA", 20);
        COUNTRY_LENGTHS.put("BE", 16); COUNTRY_LENGTHS.put("BG", 22); COUNTRY_LENGTHS.put("BH", 22);
        COUNTRY_LENGTHS.put("BR", 29); COUNTRY_LENGTHS.put("CH", 21); COUNTRY_LENGTHS.put("CR", 21);
        COUNTRY_LENGTHS.put("CY", 28); COUNTRY_LENGTHS.put("CZ", 24); COUNTRY_LENGTHS.put("DE", 22);
        COUNTRY_LENGTHS.put("DK", 18); COUNTRY_LENGTHS.put("DO", 28); COUNTRY_LENGTHS.put("EE", 20);
        COUNTRY_LENGTHS.put("ES", 24); COUNTRY_LENGTHS.put("FI", 18); COUNTRY_LENGTHS.put("FO", 18);
        COUNTRY_LENGTHS.put("FR", 27); COUNTRY_LENGTHS.put("GB", 22); COUNTRY_LENGTHS.put("GE", 22);
        COUNTRY_LENGTHS.put("GI", 23); COUNTRY_LENGTHS.put("GL", 18); COUNTRY_LENGTHS.put("GR", 27);
        COUNTRY_LENGTHS.put("GT", 28); COUNTRY_LENGTHS.put("HR", 21); COUNTRY_LENGTHS.put("HU", 28);
        COUNTRY_LENGTHS.put("IE", 22); COUNTRY_LENGTHS.put("IL", 23); COUNTRY_LENGTHS.put("IS", 26);
        COUNTRY_LENGTHS.put("IT", 27); COUNTRY_LENGTHS.put("KW", 30); COUNTRY_LENGTHS.put("KZ", 20);
        COUNTRY_LENGTHS.put("LB", 28); COUNTRY_LENGTHS.put("LI", 21); COUNTRY_LENGTHS.put("LT", 20);
        COUNTRY_LENGTHS.put("LU", 20); COUNTRY_LENGTHS.put("LV", 21); COUNTRY_LENGTHS.put("MC", 27);
        COUNTRY_LENGTHS.put("MD", 24); COUNTRY_LENGTHS.put("ME", 22); COUNTRY_LENGTHS.put("MK", 19);
        COUNTRY_LENGTHS.put("MR", 27); COUNTRY_LENGTHS.put("MT", 31); COUNTRY_LENGTHS.put("MU", 30);
        COUNTRY_LENGTHS.put("NL", 18); COUNTRY_LENGTHS.put("NO", 15); COUNTRY_LENGTHS.put("PK", 24);
        COUNTRY_LENGTHS.put("PL", 28); COUNTRY_LENGTHS.put("PS", 29); COUNTRY_LENGTHS.put("PT", 25);
        COUNTRY_LENGTHS.put("RO", 24); COUNTRY_LENGTHS.put("RS", 22); COUNTRY_LENGTHS.put("SA", 24);
        COUNTRY_LENGTHS.put("SE", 24); COUNTRY_LENGTHS.put("SI", 19); COUNTRY_LENGTHS.put("SK", 24);
        COUNTRY_LENGTHS.put("SM", 27); COUNTRY_LENGTHS.put("TN", 24); COUNTRY_LENGTHS.put("TR", 26);
        COUNTRY_LENGTHS.put("VG", 24);
    }

    public boolean validateIban(String iban) {
        if (iban == null || iban.length() < 4) return false;
        iban = iban.replaceAll("\\s+", "").toUpperCase();
        String country = iban.substring(0, 2);
        Integer expectedLength = COUNTRY_LENGTHS.get(country);
        if (expectedLength == null || iban.length() != expectedLength) return false;
        // Move first 4 chars to the end
        String rearranged = iban.substring(4) + iban.substring(0, 4);
        // Convert letters to numbers
        StringBuilder numericIban = new StringBuilder();
        for (char c : rearranged.toCharArray()) {
            if (Character.isDigit(c)) {
                numericIban.append(c);
            } else if (Character.isLetter(c)) {
                numericIban.append((int) c - 55); // 'A' -> 10
            } else {
                return false;
            }
        }
        // Perform MOD-97
        String numStr = numericIban.toString();
        int mod = 0;
        for (int i = 0; i < numStr.length(); ) {
            int chunkLen = Math.min(9, numStr.length() - i);
            String chunk = mod + numStr.substring(i, i + chunkLen);
            mod = Integer.parseInt(chunk) % 97;
            i += chunkLen;
        }
        return mod == 1;
    }
}
