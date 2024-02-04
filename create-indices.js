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
      }
    }
    console.log("Creating index: ", JSON.stringify(indexConfig,null,2))
    await client.indices.create(indexConfig);
  }

  await createIndex('monlam_tib_eng')
  await createIndex('monlam_tib_tib')
  await createIndex('phurba_mahavyutpatti')
  await createIndex('phurba_rangjung_yeshe')
  await createIndex('phurba_tshig_mdzod_chen_mo')
  await createIndex('phurba_new_english_tibetan')
  await createIndex('phurba_dag_yig_gsar_bsgrigs')
  await createIndex('phurba_tsultrim_lodro_tib_eng')
  await createIndex('phurba_tsultrim_lodro_tib_tib')

  async putAlias(index, alias) {
    await this.client
     .indices
     .putAlias({
       index: [
         'monlam_tib_eng',
         'monlam_tib_tib',
         'phurba_mahavyutpatti',
         'phurba_rangjung_yeshe',
         'phurba_tshig_mdzod_chen_mo',
         'phurba_new_english_tibetan',
         'phurba_dag_yig_gsar_bsgrigs',
         'phurba_tsultrim_lodro_tib_eng',
         'phurba_tsultrim_lodro_tib_tib'
       ],
       name: all_colloquilal_dicts
     });
    this.logElastic('info', `[ALIAS] successfully added alias [${alias}] to [${index}]!`);
   }
}

run().catch(console.log)
