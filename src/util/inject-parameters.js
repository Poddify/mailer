export default (template, params) => {
    let injected = template;

    Object.keys(params)
        .forEach((key) => {
            const paramRegex = new RegExp(`{{${key}}}`, 'g');
            const paramValue = params[key];

            injected = injected.replace(paramRegex, paramValue);
        });

    return injected;
};
