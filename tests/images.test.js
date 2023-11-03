const sinon = require('sinon');
const axios = require('axios');
const {expect} = require('chai');
const supertest = require('supertest');

const app = require('../config/setup-app')();

const request = supertest(app);

const sampleResponse = {
  delayTime: 660,
  executionTime: 6011,
  id: "sync-dd88078c-9b93-43c8-994f-d4150ce47a39-u1",
  output: [
    {
      image: "https://runpod.io/images/sync-dd88078c-9b93-43c8-994f-d4150ce47a39-u1-0.png",
      seed: 45407
    }
  ],
  status: "COMPLETED"
}

describe('Images service', () => {
  let imageId, axiosStub;

  before(() => {
    axiosStub = sinon.stub(axios, 'post').resolves({data: sampleResponse});
  });

  after(() => {
    axiosStub.restore();
  });

  it('should fail to generate image if prompt is not provided', async () => {
    const response = await request.post('/api/v1/images').send({
      image_prompt: '',
    });

    expect(response.status).to.equal(400);
    expect(response.body).to.have.property('error', 'Image prompt is required');
  });

  it('should generate and return a new image', async () => {
    const response = await request.post('/api/v1/images').send({
      image_prompt: "A beautiful landscape painting of a mountain"
    });

    expect(response.status).to.equal(201);
    expect(response.body.data).to.have.property('id', sampleResponse.id);
    expect(response.body.data).to.have.property('image_url', sampleResponse.output[0].image);
    expect(response.body.data.meta).to.have.property('status', 'COMPLETED');
    imageId = response.body.data.id;
  });

  it('should return all generated images', async () => {
    const response = await request.get('/api/v1/images');

    expect(response.status).to.equal(200);
    expect(response.body.data).to.be.an('array');
  });

  it('should return a single generated image by id', async () => {
    const response = await request.get(`/api/v1/images/${imageId}`);

    expect(response.status).to.equal(200);
    expect(response.body.data).to.have.property('id', imageId);
    expect(response.body.data).to.have.property('image_url', sampleResponse.output[0].image);
  });

  it('should return a 404 status for a non-existing image', async () => {
    const nonExistingId = 'nonexistent-image-id';
    const response = await request.get(`/api/v1/images/${nonExistingId}`);

    expect(response.status).to.equal(404);
    expect(response.body).to.have.property('error', 'Image not found');
  });
});
