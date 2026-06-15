package et.gov.mor.itas.auth.application.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class LoginResponse {
    private AuthUserDTO user;
    private String token;
    private String refreshToken;
}
