import express from 'express';
import knex from './database/connection';
import multer from 'multer';
import { celebrate, Joi } from 'celebrate';

import multerConfig from './config/multer';
import PointsController from './controllers/PointsController'
import ItemsController from './controllers/ItemsController'

const routes = express.Router();
const upload = multer(multerConfig);

const pointsController = new PointsController();
const itemsController = new ItemsController();

routes.get('/items', itemsController.index);

routes.get('/point_items', async (request, response) => {
    const items = await knex('point_items').select('*');

    const serializedItems = items.map(item => {
        return {
            point_id: item.point_id,
            item_id: item.item_id,
        };
    });

    return response.json(serializedItems);
});

routes.post('/points',
    upload.single('image'),
    celebrate({
        body: Joi.object().keys({
            name: Joi.string().required(),
            email: Joi.string().required(),
            whatsapp: Joi.string().required(),
            latitude: Joi.number().required(),
            longitude: Joi.number().required(),
            city: Joi.string().required(),
            uf: Joi.string().required().max(2),
            items: Joi.string().required(),
        })
    }, {
        abortEarly: false
    }),
    pointsController.create);

routes.get('/points/:id', pointsController.show);
routes.get('/pointsAll/', pointsController.indexAll);
routes.get('/points/', pointsController.index);
routes.put('/points/:id', pointsController.update);
routes.delete('/points/:id', pointsController.delete);

export default routes;