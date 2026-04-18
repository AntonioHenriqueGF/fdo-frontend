import CSVReader from "../components/CSVReader"
import { PreviewGrid } from "../components/PreviewGrid"
import { UserCustomInput } from "../components/UserCustomInput"
import { ImportPanelSelectionWrapper } from "./styles"

export const FileImportView: React.FC = () => {
  return (
    <>
    <CSVReader />
    <ImportPanelSelectionWrapper>
      <UserCustomInput />
      <PreviewGrid />
    </ImportPanelSelectionWrapper>
    </>
  )
}