export const formatError = (msg: string) => {
    return {
        errors: [{ msg: msg }],
    };
};
