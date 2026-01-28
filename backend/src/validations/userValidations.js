

function validateUser(name, email, password) {

    const errors = {};

    // Validar name
    if (!name || name.trim() === "") {
        errors.name = "El nombre es obligatorio";
    }

    // Validar email
    if (!email || email.trim() === "") {
        errors.email = "El email es obligatorio";
    } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            errors.email = "El email no es válido";
        }
    }

    // Validar password
    if (!password) {
        errors.password = "La contraseña es obligatoria";
    } else if (password.length < 6) {
        errors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    return {
        isValid: Object.keys(errors).length === 0,
        errors
    };
}
export default validateUser;