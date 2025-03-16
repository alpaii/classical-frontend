import { CFormSelect } from '@coreui/react'

const ROLE_CHOICES = [
  'Conductor',
  'Orchestra',
  'Ensemble',
  'Choir',
  'Piano',
  'Violin',
  'Cello',
  'Viola',
  'Double Bass',
  'Flute',
]

const RoleSelect = ({ value, onChange }) => {
  return (
    <CFormSelect
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="border border-primary"
    >
      <option value="">All</option>
      {ROLE_CHOICES.map((role) => (
        <option key={role} value={role}>
          {role}
        </option>
      ))}
    </CFormSelect>
  )
}

export default RoleSelect
