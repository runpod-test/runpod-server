const images = require('./imageservice.controllers');

module.exports = (router) => {
  router.route('/images').post(images.handleGenerateImageRequest);
  router.route('/images').get(images.handleGetAllImagesRequest);
  router.route('/images/:id').get(images.handleGetImageByIdRequest);
};
