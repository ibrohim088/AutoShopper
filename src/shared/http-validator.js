import Joi from "joi";

const httpValidator = ({ body, query, params }, schema, res) => {
    if (body) {
        const { error } = schema.body.validate(body);
        if (error) {
            res.status(400).json({ error: error?.details });
            return false; 
        }
    }
    if (params) {
        const { error } = schema.params.validate(params);
        if (error) {
            res.status(400).json({ error: error?.details });
            return false; 
        }
    }
    if (query) {
        const { error } = schema.query.validate(query);
        if (error) {
            res.status(400).json({ error: error?.details });
            return false; 
        }
    }
    return true;
};

export default httpValidator;
