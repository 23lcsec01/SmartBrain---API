const sizeOf = require('image-size');

const handleApiCall = async (req, res) => {
  const imageUrl = req.body.input;
  if (!imageUrl) {
    return res.status(400).json('image URL is required');
  }

  try {
    console.log('Fetching image from URL:', imageUrl);
    const imageResponse = await fetch(imageUrl);
    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image: ${imageResponse.statusText} (Status: ${imageResponse.status})`);
    }
    const contentType = imageResponse.headers.get('content-type') || 'image/jpeg';
    const arrayBuffer = await imageResponse.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Make API call to Hugging Face Inference API using facebook/detr-resnet-50
    const hfModel = process.env.HF_MODEL || 'facebook/detr-resnet-50';
    console.log(`Calling Hugging Face API with model: ${hfModel}`);
    const hfResponse = await fetch(
      `https://router.huggingface.co/hf-inference/models/${hfModel}`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_TOKEN}`,
          'Content-Type': contentType
        },
        method: "POST",
        body: buffer,
      }
    );

    let detections;
    const responseContentType = hfResponse.headers.get('content-type');
    if (responseContentType && responseContentType.includes('application/json')) {
      detections = await hfResponse.json();
    } else {
      const errorText = await hfResponse.text();
      console.error('Hugging Face API Error (Non-JSON):', errorText);
      return res.status(400).json('unable to work with API');
    }

    // Check if the model is currently loading on Hugging Face serverless instance
    if (detections.error && detections.estimated_time) {
      console.warn(`Hugging Face Model is currently loading. Estimated time: ${detections.estimated_time}s`);
      return res.status(503).json(`Model is loading. Please retry in ${Math.round(detections.estimated_time)} seconds.`);
    }

    if (!hfResponse.ok) {
      console.error('Hugging Face API Error Response:', detections);
      return res.status(400).json('unable to work with API');
    }

    // Return the raw detections directly as expected by the new frontend branch
    res.json(detections);

  } catch (err) {
    console.error('Error in handleApiCall:', err.message);
    res.status(400).json('unable to work with API');
  }
}

const handleImage = (req, res, db) => {
  const { id } = req.body;
  db('users').where('id', '=', id)
  .increment('entries', 1)
  .returning('entries')
  .then(entries => {
    // If you are using knex.js version 1.0.0 or higher this now returns an array of objects.
    // entries[0].entries returns the updated entries count
    res.json(entries[0].entries);
  })
  .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
  handleImage,
  handleApiCall
}