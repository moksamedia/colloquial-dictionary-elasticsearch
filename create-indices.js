const { Client } = require('@elastic/elasticsearch')
const client = new Client({
  node: 'http://127.0.0.1:9200'
})

async function run () {

  async function createIndex(name, deleteIfExists) {
    if (deleteIfExists && await client.indices.exists({index: name})) {
      await client.indices.delete({index: name})
      console.log("Deleting index "+name)
    }
    const indexConfig = {
      index: name,
      mappings: {
        properties: {
          definiendum: { type: 'text', term_vector:'with_positions_offsets'},
          definition: { type: 'text', term_vector:'with_positions_offsets'},
          source: { type: 'keyword' }
        },
      },
      settings: {
        number_of_shards:1,
        number_of_replicas:0,
      }
    }
    console.log("Creating index: ", JSON.stringify(indexConfig,null,2))
    await client.indices.create(indexConfig);
  }

  await createIndex('monlam_tib_eng',true)
  await createIndex('monlam_tib_tib',true)
  await createIndex('phurba_mahavyutpatti',true)
  await createIndex('phurba_rangjung_yeshe',true)
  await createIndex('phurba_tshig_mdzod_chen_mo',true)
  await createIndex('phurba_new_english_tibetan',true)
  await createIndex('phurba_dag_yig_gsar_bsgrigs',true)
  await createIndex('phurba_tsultrim_lodro_tib_eng',true)
  await createIndex('phurba_tsultrim_lodro_tib_tib',true)

}

run().catch(console.log)
