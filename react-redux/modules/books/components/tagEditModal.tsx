import React, { FunctionComponent, useState, useContext, useRef } from "react";

import BootstrapButton, { AjaxButton, AjaxButtonAnchor, BootstrapAnchorButton } from "applicationRoot/components/bootstrapButton";
import CustomColorPicker from "applicationRoot/components/customColorPicker";
import GenericLabelSelect from "applicationRoot/components/genericLabelSelect";
import ColorsPalette from "applicationRoot/components/colorsPalette";
import Modal from "applicationRoot/components/modal";

import UpdateTag from "graphQL/tags/updateTag.graphql";
import CreateTag from "graphQL/tags/createTag.graphql";
import DeleteTagMutation from "graphQL/tags/deleteTag.graphql";

import { useMutation, buildMutation } from "micro-graphql-react";
import { ColorsContext } from "applicationRoot/renderUI";
import { filterTags, TagsContext } from "applicationRoot/tagsState";

interface ILocalProps {
  onDone: any;
  editModalOpen: boolean;
}

const TagEditModal: FunctionComponent<ILocalProps> = props => {
  const [state, setStateRaw] = useState({
    editingTag: null,
    editingTagName: "",
    tagSearch: "",
    deletingId: "",
    saving: false,
    deleting: false
  } as any);

  const setState = newState => {
    if (typeof newState === "function") {
      setStateRaw(newState);
    } else {
      setStateRaw(state => ({ ...state, ...newState }));
    }
  };

  const setTagSearch = value => setState({ tagSearch: value });

  const newTag = () => startEditing({ _id: "", name: "", backgroundColor: "", textColor: "" });
  const editTag = tag => {
    startEditing(tag);
    setTagSearch("");
  };
  const startEditing = tag => setState({ editingTag: tag, editingTagName: tag.name });
  const cancelTagEdit = () => setState({ editingTag: null });

  const setNewTagName = value => setEditingValue("name", value);
  const setNewTagBackgroundColor = value => setEditingValue("backgroundColor", value);
  const setNewTagTextColor = value => setEditingValue("textColor", value);
  const setEditingValue = (name, value) => setState(state => ({ ...state, editingTag: { ...state.editingTag, [name]: value } }));

  const { runMutation: updateTag } = useMutation(buildMutation(UpdateTag));
  const { runMutation: createTag } = useMutation(buildMutation(CreateTag));
  const { runMutation: deleteTag } = useMutation(buildMutation(DeleteTagMutation));

  const createOrUpdateTag = () => {
    const { editingTag } = state;
    setState({ saving: true });

    const { _id, name, backgroundColor, textColor } = editingTag;
    const variables: any = { _id: _id || void 0, name, backgroundColor, textColor };
    const promise = _id ? updateTag(variables) : createTag(variables);

    promise.then(resp => {
      cancelTagEdit();
      setTagSearch("");
      setState({ saving: false });
    });
  };

  const runDelete = () => {
    setState({ deleting: true });
    Promise.resolve(deleteTag({ _id: state.editingTag._id })).then(() => {
      setState({ deleting: false });
      cancelTagEdit();
    });
  };

  let { tags } = useContext(TagsContext);

  let { colors } = useContext(ColorsContext);
  let { onDone, editModalOpen } = props;
  let { editingTag, editingTagName, tagSearch, deletingId, deleting } = state;
  let textColors = ["#ffffff", "#000000"];

  let deletingTag = deletingId ? tags.find(t => t._id == deletingId) : null;
  let deleteInfo = deletingTag ? { _id: deletingTag._id, name: deletingTag.name } : null;
  let searchedTags = filterTags(tags, tagSearch);

  return (
    <Modal isOpen={!!editModalOpen} onHide={onDone} headerCaption="Edit tags">
      <div className="visible-xs">
        <BootstrapButton onClick={newTag} preset="info-xs">
          Add new tag <i className="fa fa-fw fa-plus" />
        </BootstrapButton>
        <br />
        <br />
      </div>
      <div className="row">
        <div className="col-xs-11">
          <GenericLabelSelect
            inputProps={{ tabIndex: "-1", placeholder: "Edit tag", value: tagSearch, onChange: evt => setTagSearch(evt.target.value) }}
            suggestions={searchedTags}
            onSuggestionSelected={item => editTag(item)}
          />
        </div>
        <div className="col-xs-1" style={{ padding: 0 }}>
          <BootstrapButton className="hidden-xs" onClick={newTag} preset="info-xs">
            <i className="fa fa-fw fa-plus-square" />
          </BootstrapButton>
        </div>
      </div>
      <br />

      {editingTag ? (
        <div className="panel panel-info">
          <div className="panel-heading">
            {editingTag._id ? `Edit ${editingTagName}` : "New Tag"}
            {editingTag && editingTag._id ? (
              <BootstrapButton onClick={e => setState({ deletingId: editingTag._id })} preset="danger-xs" style={{ marginLeft: "auto" }}>
                <i className="fa fa-fw fa-trash" />
              </BootstrapButton>
            ) : null}
          </div>
          <div className="panel-body">
            <div>
              {deleteInfo ? (
                <div className="row">
                  <div className="col-xs-12">
                    <h4 style={{ marginBottom: "15px", fontSize: "16px" }}>Delete tag {editingTagName}</h4>

                    <div style={{ display: "flex" }}>
                      <AjaxButton running={deleting} runningText="Deleting" onClick={runDelete} preset="danger-xs">
                        Delete
                      </AjaxButton>
                      <BootstrapAnchorButton
                        onClick={() => setState({ deletingId: "" })}
                        deleting={deleting}
                        runningText="Deleting..."
                        preset="default-xs"
                        style={{ marginLeft: "auto" }}
                      >
                        Cancel
                      </BootstrapAnchorButton>
                    </div>
                    <hr />
                  </div>
                </div>
              ) : null}
              <div className="row">
                <div className="col-xs-6">
                  <div className="form-group">
                    <label>Tag name</label>
                    <input className="form-control" value={editingTag.name} onChange={evt => setNewTagName(evt.target.value)} />
                  </div>
                </div>
                <div className="col-xs-9">
                  <div className="form-group">
                    <label>Label color</label>
                    <div>
                      <ColorsPalette currentColor={editingTag.backgroundColor} colors={colors} onColorChosen={setNewTagBackgroundColor} />
                      <CustomColorPicker
                        labelStyle={{ marginLeft: "5px", marginTop: "3px", display: "inline-block" }}
                        onColorChosen={setNewTagBackgroundColor}
                        currentColor={editingTag.backgroundColor}
                      />
                    </div>
                  </div>
                </div>
                <div className="col-xs-3">
                  <div className="form-group">
                    <label>Text color</label>
                    <div>
                      <ColorsPalette colors={textColors} onColorChosen={setNewTagTextColor} />
                    </div>
                  </div>
                </div>
                <div className="col-xs-12">
                  <div style={{ marginTop: "10px" }} className="form-group">
                    <label>Preview &nbsp;&nbsp;</label>
                    <div className="label label-default" style={{ backgroundColor: editingTag.backgroundColor, color: editingTag.textColor }}>
                      {editingTag.name}
                    </div>
                  </div>
                </div>
              </div>
              <br style={{ clear: "both" }} />

              <div style={{ display: "flex" }}>
                <AjaxButtonAnchor className="btn btn-primary" running={state.saving} runningText={"Saving..."} onClick={createOrUpdateTag}>
                  Save
                </AjaxButtonAnchor>
                <a className="btn btn-default" onClick={cancelTagEdit} style={{ marginLeft: "auto" }}>
                  Cancel
                </a>
              </div>
            </div>
          </div>
        </div>
      ) : null}
      <hr />
      <BootstrapButton onClick={onDone}>Close</BootstrapButton>
    </Modal>
  );
};

export default TagEditModal;
