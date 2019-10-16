import { GatsbyNode } from 'gatsby'
import { createPagesRegistry, writePagesRegistry } from '../pages-registry'

const onPostBootstrap: GatsbyNode['onPostBootstrap'] = async ({
  store,
  emitter,
}) => {
  const registry = createPagesRegistry(store.getState().pages).registry
  await writePagesRegistry(registry)

  emitter.on('CREATE_PAGE', async () => {
    const registry = createPagesRegistry(store.getState().pages).registry
    await writePagesRegistry(registry)
  })

  emitter.on('DELETE_PAGE', async () => {
    const registry = createPagesRegistry(store.getState().pages).registry
    await writePagesRegistry(registry)
  })
}

export default onPostBootstrap
