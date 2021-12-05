const express = require('express')
const router = express.Router()
const auth = require('../auth')
const Top5ListController = require('../controllers/top5list-controller')

router.post('/top5list', auth.verify, Top5ListController.createTop5List)
router.delete('/top5list/:id', auth.verify, Top5ListController.deleteTop5List)
router.get('/top5list/:id', auth.verify, Top5ListController.getTop5ListById)
router.get('/top5listpairs', auth.verify, Top5ListController.getTop5ListPairs)
router.get('/top5lists', auth.verify, Top5ListController.getTop5Lists)
router.put('/top5list/:id', auth.verify, Top5ListController.updateTop5List)
router.put('/liketop5list/:id', auth.verify, Top5ListController.likeTop5List)
router.put('/disliketop5list/:id', auth.verify, Top5ListController.dislikeTop5List)
router.put('/publishtop5list/:id', auth.verify, Top5ListController.publishTop5List)
router.put('/viewtop5list/:id', auth.verify, Top5ListController.viewTop5List)

module.exports = router