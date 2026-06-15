package et.gov.mor.itas.auth.application.dto;

import et.gov.mor.itas.auth.domain.Role;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;
import java.util.UUID;

/**
 * Auth user DTO matching frontend interface:
 * { id, username, fullName, email, tin, roles[] }
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthUserDTO {
    private UUID id;
    private String username;
    private String fullName;
    private String email;
    private String tin;
    private List<Role> roles;
}
