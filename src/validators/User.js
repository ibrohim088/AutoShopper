import Joi from "joi";

export const httpValidator = ({ body, query, params }, schema, res) => {
   if (body) {
      const { error } = schema.body.validate(body);
      if (error) {
         res.status(400).json({ error: error?.details });
         return false;
      }
      return true;
   }
   if (params) {
      const { error } = schema.params.validate(params);
      if (error) {
         res.status(400).json({ error: error?.details });
         return false;
      }
      return true;
   }
   if (query) {
      const { error } = schema.query.validate(query);
      if (error) {
         res.status(400).json({ error: error?.details });
         return false;
      }
      return true;
   }
   return true;
};

export const postSchema = {
   body: Joi.object({
      name: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().min(6).required()
   })
};
