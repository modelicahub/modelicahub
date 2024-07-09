package tree_sitter_modelica36_test

import (
	"testing"

	tree_sitter "github.com/smacker/go-tree-sitter"
	"github.com/tree-sitter/tree-sitter-modelica36"
)

func TestCanLoadGrammar(t *testing.T) {
	language := tree_sitter.NewLanguage(tree_sitter_modelica36.Language())
	if language == nil {
		t.Errorf("Error loading Modelica36 grammar")
	}
}
