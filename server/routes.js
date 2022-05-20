var controller = require('./controller.js');
const router = require ('express').Router();

router.get(`/${process.env.LOADERIO_TOKEN}`, async (req, res) => {
  try {
    res.send(process.env.LOADERIO_TOKEN);
  } catch (error) {
    res.send(error);
  }
});

// get and add questions
router.route('/qa/questions')
  .get(controller.getQuestions)
  .post(controller.addQuestion)

// get and add answers
router.route('/qa/questions/:question_id/answers')
  .get(controller.getAnswers)
  .post(controller.addAnswer)

// mark question as helpful
router.route('/qa/questions/:question_id/helpful')
  .put(controller.helpfulQuestion)

// report question
router.route('/qa/questions/:question_id/report')
  .put(controller.reportQuestion)

// mark answer as helpful
router.route('/qa/answers/:answer_id/helpful')
  .put(controller.helpfulAnswer)

// report an answer
router.route('/qa/answers/:answer_id/report')
  .put(controller.reportAnswer)


module.exports = router;