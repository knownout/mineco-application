import { ItemObject } from "../../../control-panel/components/root-form/item-object-renderers/renderers";

export interface SearchRendererState
{
    materialsList: ItemObject.Material[];
    totalMaterials: number;

    loading: boolean;
    error?: any;

    material?: ItemObject.FullMaterial;
}
