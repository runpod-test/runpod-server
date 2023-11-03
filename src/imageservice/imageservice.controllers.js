const axios = require('axios');
const logger = require("../../utils/logger");

const generatedImages = [];

const handleGenerateImageRequest = async (req, res) => {
  if (!req.body.image_prompt) {
    logger.error('Image prompt is required');
    return res.status(400).json({error: 'Image prompt is required'});
  }

  try {
    const payload = {
      input: {
        prompt: req.body.image_prompt,
        width: req.body.image_width || 512,
        height: req.body.image_height || 512,
        guidance_scale: 7.5,
        num_inference_steps: 50,
        num_outputs: 1,
        prompt_strength: 1,
        scheduler: "KLMS"
      }
    }

    const response = await axios.post(process.env.RUNPOD_API_URL, payload, {
      headers: {
        'content-type': 'application/json',
        'authorization': process.env.RUNPOD_API_KEY
      },
    });

    // Add id and image url from response to top level of stored object along with the image prompt
    // Store the full response in meta for future reference
    const responseData = {
      id: response.data.id,
      image_prompt: req.body.image_prompt,
      image_url: response.data.output[0].image,
      meta: response.data
    };

    generatedImages.push(responseData);
    logger.info('Image generated successfully', {
      image_prompt: req.body.image_prompt,
      ...responseData.meta
    })
    res.status(201).json({message: 'Image generated successfully', data: responseData});
  } catch (error) {
    logger.error('Failed to generate image', {error});
    res.status(500).json({error: 'Failed to generate image'});
  }
}

const handleGetAllImagesRequest = async (req, res) => {
  // We can add pagination here in the future
  // We can also do some filtering here to remove the meta field from the response

  logger.info('All images retrieved successfully', {
    images_count: generatedImages.length
  });
  res.status(200).json({data: generatedImages});
}

const handleGetImageByIdRequest = async (req, res) => {
  const [, id] = req.url.split('/images/');
  const image = generatedImages.find((img) => img.id === id);

  if (!image) {
    logger.info('Image not found', {id});
    res.status(404).json({error: 'Image not found'});
  } else {
    logger.info('Image retrieved successfully', {
      image_prompt: image.image_prompt, ...image.meta
    });
    res.status(200).json({data: image});
  }
}

module.exports = {
  handleGenerateImageRequest,
  handleGetAllImagesRequest,
  handleGetImageByIdRequest
};
