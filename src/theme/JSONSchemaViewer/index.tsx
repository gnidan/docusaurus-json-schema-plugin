import React, { useState, useEffect } from "react"
import { Resolver } from "@stoplight/json-ref-resolver"

import { CreateNodes, Collapsible } from "./components/index"

import type { JSONSchema } from "./types"
import type { IResolveOpts } from "@stoplight/json-ref-resolver/types"

export type Props = {
  // The schema to use
  schema: unknown
  // To customize the ref resolving
  resolverOptions?: IResolveOpts
  [x: string]: any
}

type InnerViewerProperties = {
  // Thanks to @stoplight/json-ref-resolver, $ref are either :
  // 1. resolved
  // 2. unresolved (as circular stuff are not on the roadmap)
  schema: JSONSchema
}

// Internal
function JSONSchemaInnerViewer(props: InnerViewerProperties): JSX.Element {
  const { schema } = props
  // Title of the schema, for user friendliness
  const title =
    typeof schema !== "boolean" && schema?.title !== undefined
      ? schema.title
      : "Schema"
  return (
    <Collapsible
      summary={<strong>{title}</strong>}
      detailsProps={{
        open: true,
      }}
    >
      <CreateNodes schema={schema} />
    </Collapsible>
  )
}

// Entry point
export default function JSONSchemaViewer(props: Props): JSX.Element {
  const { schema: originalSchema, resolverOptions } = props

  const [error, setError] = useState(undefined as undefined | Error)
  const [resolvedSchema, setResolvedSchema] = useState(
    undefined as undefined | JSONSchema
  )

  useEffect(() => {
    // Time to do the job
    new Resolver()
      .resolve(originalSchema, resolverOptions)
      .then((result) => {
        setResolvedSchema(result.result)
      })
      .catch((err) => {
        setError(err)
      })
  }, [])

  if (error !== undefined) {
    return <div>Something bad happens : {error.message}</div>
  } else if (resolvedSchema === undefined) {
    return <div>Loading ....</div>
  } else {
    return <JSONSchemaInnerViewer schema={resolvedSchema} />
  }
}
