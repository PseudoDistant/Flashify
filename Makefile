# The name of the extension.
extension_name := flashify

# The domain name of the developer
dev_domain := pseudodistant.dev

# The name of the profile dir where the extension can be installed.
profile_dir := BasiliskDev

# The zip application to be used.
ZIP := zip

# The target location of the build and build files.
bin_dir := ./bin

version := $(shell xmlstarlet sel -t -v "/_:RDF/_:Description/@em:version" install.rdf)
extension_uuid := $(shell xmlstarlet sel -t -v "/_:RDF/_:Description/@em:id" install.rdf)

# The target XPI file.
xpi_file := $(bin_dir)/$(extension_name)@$(dev_domain).xpi

# The type of operating system this make command is running on.
os_type := $(patsubst darwin%,darwin,$(shell echo $(OSTYPE)))


# The location of the extension profile.
    profile_location := \
      ~/.basilisk-dev/basilisk/$(profile_dir)/extensions/

# The temporary location where the extension tree will be copied and built.
build_dir := $(bin_dir)/build

# This builds the extension XPI file.
.PHONY: all
all: $(xpi_file)
	@echo
	@echo "Build finished successfully."
	@echo

# This cleans all temporary files and directories created by 'make'.
.PHONY: clean
clean:
	@rm -rf $(build_dir)/*
	@rm -f $(xpi_file)
	@echo "Cleanup is done."

# The sources for the XPI file.
xpi_built := install.rdf \
             chrome.manifest \
             $(wildcard content/*.js) \
             $(wildcard content/*.xul) \
             $(wildcard skin/*.png) \
             $(wildcard skin/*.css) \
             $(wildcard locale/*/*.dtd) \
             $(wildcard locale/*/*.properties)\
             $(wildcard defaults/*/*.js)

# This builds everything except for the actual XPI, and then it copies it to the
# specified profile directory, allowing a quick update that requires no install.
.PHONY: install
install: $(build_dir) $(xpi_built)
	@echo "Installing in profile folder: $(profile_location)"
#	@cp -Rf $(build_dir)/* $(profile_location)
	@cp -Rf ./bin/*.xpi $(profile_location)
	@echo "Installing in profile folder. Done!"
	@echo


$(xpi_file): $(xpi_built)
	@echo "Creating XPI file "
	@$(ZIP) $(xpi_file) $(xpi_built)
	@echo "Created "$(extension_name)-$(version).xpi
