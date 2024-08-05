import click 
import os
from .builder import build_page
from .utils import load_template_file

@click.group
def handoutr_base():
    pass 


@handoutr_base.command()
@click.argument('filepath', type=click.Path(exists=True))
def build(filepath):
    '''
    '''
    basepath,filename = os.path.split(filepath)
    basename, ext = filename.split('.')
    with open(filepath,'r') as f:
        file_text = f.read()
    
    handout_html = build_page(file_text)

    # figure out dir and make htlm subfodler if needed
    out_dir = os.path.join(basepath,'html')
    if not(os.path.exists(out_dir)):
        os.mkdir(out_dir)
    
    # write the thml
    out_path = os.path.join(out_dir,basename + '.html')
    with open(out_path,'w') as f:
        f.write(handout_html)

    # copy supporting files
    supporting_file_list = ['handout.js','handout.css']
    for file in supporting_file_list:
        file_content = load_template_file(file)
        with open(os.path.join(out_dir,file),'w') as f:
            f.write(file_content)
    
    click.echo('file created at ' + out_path)
