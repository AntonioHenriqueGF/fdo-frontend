import { useAtom } from "jotai";
import { NumberField } from "../../../../shared/components/NumberField";
import { dataStartLineSelectedSpreadAtom, headerLineSelectedSpreadAtom } from "../../atoms/importAtoms";
import { UserCustomInputWrapper } from "./styles";

export const UserCustomInput: React.FC = () => {
    const [headerLineSelected, setHeaderLineSelected] = useAtom(headerLineSelectedSpreadAtom);
    const [dataStartLineSelected, setDataStartLineSelected] = useAtom(dataStartLineSelectedSpreadAtom);
    return (<UserCustomInputWrapper>
        <NumberField min={0} max={30} size="small" label="Header start line" value={headerLineSelected} onValueChange={(value) => setHeaderLineSelected(value ?? 0)} />
        <NumberField min={0} max={30} size="small" label="Data start line" value={dataStartLineSelected} onValueChange={(value) => setDataStartLineSelected(value ?? 0)} />
    </UserCustomInputWrapper>);
};