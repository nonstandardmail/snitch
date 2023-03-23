export type EvaluationReason =
  | 'UNKNOWN_EVALUATION_REASON'
  | 'FLAG_DISABLED_EVALUATION_REASON'
  | 'FLAG_NOT_FOUND_EVALUATION_REASON'
  | 'MATCH_EVALUATION_REASON'
  | 'ERROR_EVALUATION_REASON'

export const EvaluationReason = {
  UnknownEvaluationReason: 'UNKNOWN_EVALUATION_REASON',
  FlagDisabledEvaluationReason: 'FLAG_DISABLED_EVALUATION_REASON',
  FlagNotFoundEvaluationReason: 'FLAG_NOT_FOUND_EVALUATION_REASON',
  MatchEvaluationReason: 'MATCH_EVALUATION_REASON',
  ErrorEvaluationReason: 'ERROR_EVALUATION_REASON'
} as const

export interface EvaluationRequest {
  flagKey: string
  entityId: string
  context: Record<string, string>
}

export interface EvaluationResponse {
  requestId: string
  entityId: string
  requestContext: Record<string, string>
  match: boolean
  flagKey: string
  segmentKey: string
  timestamp: Date
  value: string
  requestDurationMillis: number
  attachment: string
  reason: EvaluationReason
}

export interface BatchEvaluationResponse {
  requestId: string
  response: EvaluationResponse[]
  requestDurationMillis: number
}

export default (flagApiEndpoint: string) => {
  return {
    evaluateFlag: async (evaluationRequest: EvaluationRequest): Promise<EvaluationResponse> => {
      const methodName = 'evaluate'
      const evaluationResult = await window.fetch(`${flagApiEndpoint}${methodName}`, {
        method: 'POST',
        body: JSON.stringify(evaluationRequest)
      })
      if (evaluationResult.status >= 400)
        throw new Error(
          `Evaluation failed for flag ${evaluationRequest.flagKey} with status ${evaluationResult.status}`
        )
      return (await evaluationResult.json()) as EvaluationResponse
    },
    evaluateFlagBatch: async (
      evaluationRequests: EvaluationRequest[]
    ): Promise<BatchEvaluationResponse> => {
      const methodName = 'batchEvaluate'
      const evaluationResult = await window.fetch(`${flagApiEndpoint}${methodName}`, {
        method: 'POST',
        body: JSON.stringify({ requests: evaluationRequests })
      })
      if (evaluationResult.status >= 400)
        throw new Error(
          `Batch evaluation failed for flags ${evaluationRequests
            .map(request => request.flagKey)
            .join(', ')} with status ${evaluationResult.status}`
        )
      return (await evaluationResult.json()) as BatchEvaluationResponse
    }
  }
}
