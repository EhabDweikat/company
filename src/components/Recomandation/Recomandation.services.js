const { Material, Review,Category }= require('../materialsAndReview/materilas.module');
const { TfIdf } = require('natural');

// Get recommended materials for a given material id
exports.getRecommendedMaterials = async (req, res) => {
  const { id } = req.params;

  try {
    // Get the material for the given id
    const material = await Material.findById(id);

    // Extract material attributes
    const materialCategory = material.category;
    const materialPrice = material.price;
    const materialDescription = material.description;

    // Get all materials in the same category as the material
    const materials = await Material.find({ category: materialCategory });

    // Extract attributes for all materials
    const materialAttributes = materials.map(m => {
      const tfidf = new TfIdf();
      tfidf.addDocument(m.description);
      const tfidfVector = tfidf.tfidf;
      return {
        id: m._id,
        price: m.price,
        description: m.description,
        vector: tfidfVector
      }
    });

    // Calculate similarity between the material and all other materials
    const tfidf = new TfIdf();
    tfidf.addDocument(materialDescription);
    const materialVector = tfidf.tfidf;
    const similarMaterials = materialAttributes
      .map(m => ({
        id: m.id,
        similarity: cosineSimilarity(m.vector, materialVector)
      }))
      .filter(m => m.id != id)
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, 5);

    // Get details for recommended materials
    const recommendedMaterials = await Promise.all(similarMaterials.map(async m => {
      const material = await Material.findById(m.id);
      return {
        id: material._id,
        name: material.name,
        price: material.price,
        description: material.description,
        imageUrl: `${req.protocol}://${req.get('host')}/uploads/${material.media}`
      }
    }));

    return res.status(200).json({ message: 'Recommended materials found', recommendedMaterials });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vec1, vec2) {
  let dotProduct = 0;
  let vec1Magnitude = 0;
  let vec2Magnitude = 0;
  for (let i = 0; i < vec1.length; i++) {
    dotProduct += vec1[i] * vec2[i];
    vec1Magnitude += vec1[i] * vec1[i];
    vec2Magnitude += vec2[i] * vec2[i];
  }
  vec1Magnitude = Math.sqrt(vec1Magnitude);
  vec2Magnitude = Math.sqrt(vec2Magnitude);
  return dotProduct / (vec1Magnitude * vec2Magnitude);
}
