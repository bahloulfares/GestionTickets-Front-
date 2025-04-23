export const Role = {
    ROLE_AUTRE: "ROLE_AUTRE",
    ROLE_ADMIN: "ROLE_ADMIN"
    
};

export const RoleOptions = [
    { value: Role.ROLE_ADMIN, label: "Admin" },
    { value: Role.ROLE_AUTRE, label: "Autre" }
];

export const getRoleLabel = (roleValue) => {
    const option = RoleOptions.find(opt => opt.value === roleValue);
    return option ? option.label : roleValue;
};