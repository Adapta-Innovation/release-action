"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const core = __importStar(require("@actions/core"));
const fs_1 = require("fs");
class CoreInputs {
    constructor(artifactGlobber, context) {
        this.artifactGlobber = artifactGlobber;
        this.context = context;
    }
    get allowUpdates() {
        const allow = core.getInput('allowUpdates');
        return allow == 'true';
    }
    get artifacts() {
        let artifacts = core.getInput('artifacts');
        if (!artifacts) {
            artifacts = core.getInput('artifact');
        }
        if (artifacts) {
            let contentType = core.getInput('artifactContentType');
            if (!contentType) {
                contentType = 'raw';
            }
            return this.artifactGlobber
                .globArtifactString(artifacts, contentType);
        }
        return [];
    }
    get body() {
        if (CoreInputs.omitBody())
            return undefined;
        const body = core.getInput('body');
        if (body) {
            return body;
        }
        const bodyFile = core.getInput('bodyFile');
        if (bodyFile) {
            return this.stringFromFile(bodyFile);
        }
        return '';
    }
    static omitBody() {
        return core.getInput('omitBody') == 'true';
    }
    get commit() {
        return core.getInput('commit');
    }
    get draft() {
        const draft = core.getInput('draft');
        return draft == 'true';
    }
    get name() {
        if (CoreInputs.omitName())
            return undefined;
        const name = core.getInput('name');
        if (name) {
            return name;
        }
        return this.tag;
    }
    static omitName() {
        return core.getInput('omitName') == 'true';
    }
    get prerelease() {
        const preRelease = core.getInput('prerelease');
        return preRelease == 'true';
    }
    get replacesArtifacts() {
        const replaces = core.getInput('replacesArtifacts');
        return replaces == 'true';
    }
    get tag() {
        const tag = core.getInput('tag');
        if (tag) {
            return tag;
        }
        const ref = this.context.ref;
        const tagPath = "refs/tags/";
        if (ref && ref.startsWith(tagPath)) {
            return ref.substr(tagPath.length, ref.length);
        }
        throw Error("No tag found in ref or input!");
    }
    get token() {
        return core.getInput('token', { required: true });
    }
    stringFromFile(path) {
        return fs_1.readFileSync(path, 'utf-8');
    }
}
exports.CoreInputs = CoreInputs;
