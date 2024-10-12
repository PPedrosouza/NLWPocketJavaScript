import { Plus } from 'lucide-react'
import { OutlineButton } from './ui/outline-button'
import { getPedingGoals } from '../http/get-peding-goals'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { creaGoalCompletion } from '../http/create-goal-completion'

export function PendingGoals() {
  const queryClient = useQueryClient()

  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: getPedingGoals,
    staleTime: 1000 * 60, // 60 segundos
  })

  if (!data) {
    return null
  }

  async function handleCompleteGoal(goalId: string) {
    await creaGoalCompletion(goalId)

    queryClient.invalidateQueries({ queryKey: ['summary'] })
  }

  return (
    <div className="flex flex-wrap gap-3">
      {data.map(goal => (
        <OutlineButton
          key={goal.id}
          disabled={goal.completionCount >= goal.desiredWeeklyFrequency}
          onClick={() => handleCompleteGoal(goal.id)}
        >
          <Plus size={24} className="text-zinc-400" />
          {goal.title}
        </OutlineButton>
      ))}
    </div>
  )
}
