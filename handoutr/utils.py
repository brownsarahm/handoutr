import os
import pkg_resources as pkgrs

def load_template_file(*args):
    '''
    pass sub path to the needed file from assets as separate parameters and load the 
    content from the file
    '''
    template_rel = os.path.join('assets', *args)
    template_path = pkgrs.resource_filename(__name__, template_rel)
    with open(template_path, 'r') as tmpt_f:
        template = tmpt_f.read()
    
    return(template)