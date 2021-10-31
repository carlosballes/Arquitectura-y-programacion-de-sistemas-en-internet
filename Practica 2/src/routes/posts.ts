import express from 'express';
import controller from '../controllers/posts';
const router = express.Router();

router.get('/posts', controller.getStatus);

router.get('/character', controller.getCharacters);
router.get('/character/:id', controller.getCharacterId);
router.put('/character/:id', controller.putSwichStatus);
router.delete('/character/:id', controller.deleteCharacter);

export = router;